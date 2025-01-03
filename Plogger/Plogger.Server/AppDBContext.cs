﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Plogger.Server.Models;

namespace Plogger.Server
{
    public class AppDBContext : IdentityDbContext<LoggerUser>
    {
        public DbSet<Pipeline> Pipelines { get; set; }
        public DbSet<Log> Logs { get; set; }
        public DbSet<Entry> Entries { get; set; }
        public DbSet<Session> Sessions { get; set; }

        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pipeline>().HasMany(p => p.Logs).WithOne().HasForeignKey(l => l.PipelineId);
            modelBuilder.Entity<Log>().HasMany(l => l.Entries).WithOne().HasForeignKey(e => e.LogId);
            base.OnModelCreating(modelBuilder);
        }
    }
}
