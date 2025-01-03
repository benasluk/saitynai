﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Plogger.Server;

#nullable disable

namespace Plogger.Server.Migrations
{
    [DbContext(typeof(AppDBContext))]
    [Migration("20241012181439_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Plogger.Server.Models.Entry", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("LogId")
                        .HasColumnType("uuid");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("LogId");

                    b.ToTable("Entries");
                });

            modelBuilder.Entity("Plogger.Server.Models.Log", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("PipelineId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("PipelineId");

                    b.ToTable("Logs");
                });

            modelBuilder.Entity("Plogger.Server.Models.Pipeline", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Pipelines");
                });

            modelBuilder.Entity("Plogger.Server.Models.Entry", b =>
                {
                    b.HasOne("Plogger.Server.Models.Log", null)
                        .WithMany("Entries")
                        .HasForeignKey("LogId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Plogger.Server.Models.Log", b =>
                {
                    b.HasOne("Plogger.Server.Models.Pipeline", null)
                        .WithMany("Logs")
                        .HasForeignKey("PipelineId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Plogger.Server.Models.Log", b =>
                {
                    b.Navigation("Entries");
                });

            modelBuilder.Entity("Plogger.Server.Models.Pipeline", b =>
                {
                    b.Navigation("Logs");
                });
#pragma warning restore 612, 618
        }
    }
}
